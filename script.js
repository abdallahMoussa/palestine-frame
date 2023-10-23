window.onload = () => {
  const canvas = document.getElementById("combinedCanvas");
  const ctx = canvas.getContext("2d");
  var frame = document.getElementById("frame1");
  const frameImages = document.querySelectorAll(".frame");
  const combineButton = document.getElementById("combineImages");
  const downloadLink = document.getElementById("downloadLink");

  const picInput = document.getElementById("picInput");
  var pic;
  picInput.addEventListener("change", function () {
    pic = new Image();
    const file = picInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      pic.src = e.target.result;

      pic.onload = function () {
        combineButton.disabled = false; // Enable combine button once the pic is loaded
      };
    };

    reader.readAsDataURL(file);
  });

  const convert = () => {
    canvas.width = 400;
    canvas.height = 400;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(pic, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.style.display = "flex";
    window.scrollTo(0, 0);
  };
  combineButton.addEventListener("click", convert);

  document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
    });

    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    });

    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });

    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();

      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      }

      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  frameImages.forEach((frameImage) => {
    frameImage.addEventListener("click", function () {
      frameImages.forEach((image) => image.classList.remove("selected"));
      frameImage.classList.add("selected");
      frame = document.querySelector(".selected");
      if (pic) {
        combineButton.click();
      } else {
        Swal.fire({
          title: "من فضلك قم بأختيار الصورة",
          text: "اضف صورتك الشخصيع",
          icon: "info",
          confirmButtonText: "حسنا",
        });
      }
    });
  });

  function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
    setTimeout(() => {
      combineButton.click();
    }, 200);
  }
};
