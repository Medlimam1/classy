import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'classy-store',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const uploadResult = result as any

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

// Generate signature for client-side uploads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = searchParams.get('folder') || 'classy-store'

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        transformation: 'w_800,h_800,c_limit,q_auto,f_auto'
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    })
  } catch (error) {
    console.error('Signature generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    )
  }
}