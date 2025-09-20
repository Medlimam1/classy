import fs from 'fs/promises'
import path from 'path'

type FilePayload = {
  name: string
  data: string // data URL or base64
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || !Array.isArray(body.files)) {
      return new Response(JSON.stringify({ message: 'Invalid payload' }), { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const urls: string[] = []

    for (const f of body.files as FilePayload[]) {
      const name = f.name || `file-${Date.now()}`
      const data: string = f.data

      // support data URL: data:<mime>;base64,<data>
      const match = String(data).match(/^data:(.+);base64,(.+)$/)
      let buffer: Buffer
      let ext = path.extname(name)

      if (match) {
        const mime = match[1]
        const b64 = match[2]
        buffer = Buffer.from(b64, 'base64')
        if (!ext) {
          // basic mime -> ext mapping
          if (mime === 'image/jpeg') ext = '.jpg'
          else if (mime === 'image/png') ext = '.png'
          else if (mime === 'image/gif') ext = '.gif'
          else if (mime === 'image/webp') ext = '.webp'
          else ext = ''
        }
      } else {
        // assume plain base64
        buffer = Buffer.from(data, 'base64')
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
      const filepath = path.join(uploadDir, filename)
      await fs.writeFile(filepath, buffer)
      urls.push(`/uploads/${filename}`)
    }

    return new Response(JSON.stringify({ urls }), { status: 200 })
  } catch (e) {
    console.error('Upload error', e)
    return new Response(JSON.stringify({ message: 'Upload failed' }), { status: 500 })
  }
}
