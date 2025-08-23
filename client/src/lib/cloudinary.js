import { Cloudinary } from '@cloudinary/url-gen'

// Initialize Cloudinary
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
})

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, folder = 'instagram-crm') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    })

    if (!response.ok) {
      throw new Error('Delete failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

export default cloudinary