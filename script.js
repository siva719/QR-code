function updatePlaceholder() {
    const type = document.getElementById("type-select").value;
    const inputField = document.getElementById("input-field");
    inputField.value = "";

    // Update placeholder based on selected type
    switch (type) {
        case "url":
            inputField.placeholder = "Enter a URL (e.g., https://example.com)";
            break;
        case "phonepe":
            inputField.placeholder = "Enter your UPI ID (e.g., your_upi_id@bank)";
            break;
        case "whatsapp":
            inputField.placeholder = "Enter your phone number with country code (e.g., 1234567890)";
            break;
        case "social":
            inputField.placeholder = "Enter your profile link (e.g., https://instagram.com/username)";
            break;
        case "instagram":
            inputField.placeholder = "Enter your Instagram username or profile link (e.g., https://instagram.com/username)";
            break;
        case "facebook":
            inputField.placeholder = "Enter your Facebook username or profile link (e.g., https://facebook.com/username)";
            break;
    }
}

function generateQRCode() {
    const type = document.getElementById("type-select").value;
    const inputValue = document.getElementById("input-field").value.trim();
    const qrContainer = document.getElementById("qrcode");
    const errorMessage = document.getElementById("error-message");
    const shareButtons = document.getElementById("share-buttons");

    errorMessage.innerHTML = "";
    // Clear any previous QR code
    qrContainer.innerHTML = "";
    shareButtons.style.display = "none";

    if (!inputValue) {
        errorMessage.innerHTML = "Please enter a value!";
        return;
    }

    let qrData = "";
    let iconSrc = "";

    // Generate data based on selected type
    switch (type) {
        case "url":
            qrData = inputValue;
            iconSrc = "./icons/url-icon.jpg";  // URL icon (or any other custom icon you want)
            break;

        case "phonepe":
            qrData =`upi://pay?pa=${encodeURIComponent(inputValue)}`;
            iconSrc = "./iconsphonepe-icon.jpg"; // Path to PhonePe icon
            break;

        case "whatsapp":
            qrData = `https://wa.me/${inputValue}`;
            iconSrc = "./icons/whatsapp-icon.jpg"; // Path to WhatsApp icon
            break;

        case "instagram":
            qrData = `https://instagram.com/${inputValue}`;
            iconSrc = "./icons/instagram-icon.jpg"; // Path to Instagram icon
            break;

        case "facebook":
            qrData = `https://facebook.com/${inputValue}`;
            iconSrc = "./icons/facebook-icon.jpg"; // Path to Facebook icon
            break;

        case "social":
            qrData = inputValue;
            iconSrc = "./icons/social-media-icon.jpg";
            break;

        default:
            errorMessage.innerHTML = "Invalid type selected!";
            return;
    }

    new QRCode(qrContainer, qrData);
      shareButtons.style.display = "block";

      
}







function getQRCodeImageData() {
    const qrCodeCanvas = document.querySelector("#qrcode canvas");
    if (qrCodeCanvas) {
        return qrCodeCanvas.toDataURL("image/png"); // Get the QR code image as a Base64 URL
    }
    return null;
}

// Upload the base64 image to Imgur
function uploadImageToImgur(base64Image) {
    return new Promise((resolve, reject) => {
        const clientId = 'YOUR_IMGUR_CLIENT_ID';  // Replace with your Imgur API key
        const url = 'https://api.imgur.com/3/image';

        const headers = {
            'Authorization': `Client-ID ${clientId}`
        };

        const formData = new FormData();
        formData.append('image', base64Image.split(',')[1]);  // Remove base64 header

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data.data.link);  // Return the URL of the uploaded image
            } else {
                reject("Upload failed");
            }
        })
        .catch(error => reject(error));
    });
}

// Share the uploaded QR code image on WhatsApp
function shareOnWhatsApp() {
    const qrImage = getQRCodeImageData();  // Get the QR code image data as base64

    if (qrImage) {
        uploadImageToImgur(qrImage)
            .then((imageURL) => {
                // Share the image URL via WhatsApp
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent("Check out this QR code: " + imageURL)}`;
                window.open(whatsappUrl, "_blank");  // Open WhatsApp with the image URL
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
            });
    }
}

// Share the uploaded QR code image on Facebook
function shareOnFacebook() {
    const qrImage = getQRCodeImageData();  // Get the QR code image data as base64

    if (qrImage) {
        uploadImageToImgur(qrImage)
            .then((imageURL) => {
                // Share the image URL via Facebook
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageURL)}`;
                window.open(facebookUrl, "_blank");  // Open Facebook with the image URL
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
            });
    }
}

function downloadQR() {
    const qrImage = getQRCodeImageData();
    if (qrImage) {
        const a = document.createElement("a");
        a.href = qrImage;
        a.download = "qrcode.png";
        a.click();
    }
}