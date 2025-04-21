// Cloudinary configuration for the frontend
const CLOUDINARY_CLOUD_NAME = 'dn4bhrfda';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

// Global variable to store the Cloudinary widget
let cloudinaryWidget;

// Initialize Cloudinary upload widget
function initCloudinaryWidget() {
  if (cloudinaryWidget) {
    return cloudinaryWidget;
  }
  
  cloudinaryWidget = cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      folder: 'collegehub',
      cropping: false,
      multiple: false,
      sources: ['local', 'camera'],
      styles: {
        palette: {
          window: '#F5F5F5',
          sourceBg: '#FFFFFF',
          windowBorder: '#90a0b3',
          tabIcon: '#0094c7',
          inactiveTabIcon: '#69778A',
          menuIcons: '#0094C7',
          link: '#53ad9d',
          action: '#8F5DA5',
          inProgress: '#0194c7',
          complete: '#53ad9d',
          error: '#c43737',
          textDark: '#000000',
          textLight: '#FFFFFF'
        },
        fonts: {
          default: null,
          "'Poppins', sans-serif": {
            url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;800&display=swap',
            active: true
          }
        }
      }
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        // Return the Cloudinary results to the caller
        window.lastUploadedImage = {
          publicId: result.info.public_id,
          url: result.info.secure_url,
          cloudinaryId: result.info.public_id
        };
        console.log('Image uploaded to Cloudinary:', window.lastUploadedImage);
        
        // Trigger the custom event
        const event = new CustomEvent('cloudinaryUploadSuccess', {
          detail: window.lastUploadedImage
        });
        document.dispatchEvent(event);
      }
    }
  );
  
  return cloudinaryWidget;
}

// Show the upload widget
function showCloudinaryUploader() {
  const widget = initCloudinaryWidget();
  widget.open();
}

// Make functions globally accessible
window.initCloudinaryWidget = initCloudinaryWidget;
window.showCloudinaryUploader = showCloudinaryUploader; 