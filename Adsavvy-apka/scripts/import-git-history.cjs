#!/usr/bin/env node
// Imports git commit history from all projects into Supabase activity_log

const { execSync } = require('child_process')
const https = require('https')

const SUPABASE_URL = 'ufdsgusvztiplosjqhoh.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZHNndXN2enRpcGxvc2pxaG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNDM4NjUsImV4cCI6MjA5MzgxOTg2NX0.S7TESNj8HIA5oGmIwtnb1IDc8QaUb5ODxUTVPOBfCX4'

const PROJECTS = [
  { name: 'AdSavvy',       path: 'C:/Users/pc/Desktop/strony/AdSavvy' },
  { name: 'adsavvy-video', path: 'C:/Users/pc/Desktop/strony/AdSavvy-video' },
  { name: 'adsavvy-apka',  path: 'C:/Users/pc/Desktop/strony/Adsavvy-apka' },
]

function post(body) {
  return new Promise((resolve) => {
    const json = JSON.stringify(body)
    const options = {
      hostname: SUPABASE_URL,
      path: '/rest/v1/activity_log',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(json),
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
    }
    const req = https.request(options, (res) => {
      res.resume()
      res.on('end', resolve)
    })
    req.on('error', resolve)
    req.write(json)
    req.end()
  })
}

async function importProject({ name, path }) {
  let log
  try {
    log = execSync(
      'git log --format="%H|%aI|%s" --no-merges',
      { cwd: path, encoding: 'utf8' }
    ).trim()
  } catch {
    console.log(`  [skip] ${name} — brak git repo`)
    return 0
  }

  const commits = log.split('\n').filter(Boolean)
  let count = 0

  for (const line of commits) {
    const [hash, date, ...msgParts] = line.split('|')
    const message = msgParts.join('|').trim()

    // Get files changed in this commit
    let files
    try {
      files = execSync(
        `git diff-tree --no-commit-id -r --name-only ${hash}`,
        { cwd: path, encoding: 'utf8' }
      ).trim().split('\n').filter(Boolean)
    } catch {
      files = []
    }

    const filePath = files.length > 0 ? files[0] : null
    const fileCount = files.length

    await post({
      project: name,
      tool: 'git-commit',
      file_path: fileCount > 1
        ? `${message} (${fileCount} plików)`
        : message,
      created_at: date,
    })
    count++
  }

  return count
}

async function main() {
  console.log('Importowanie historii git do AdSavvy Activity Log...\n')
  let total = 0

  for (const project of PROJECTS) {
    process.stdout.write(`${project.name}... `)
    const count = await importProject(project)
    console.log(`${count} commitów`)
    total += count
  }

  console.log(`\nGotowe! Zaimportowano ${total} wpisów.`)
}

main()
