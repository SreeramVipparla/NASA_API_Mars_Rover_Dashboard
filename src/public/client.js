let store = {
  roverInfo: {},
  images: [],
  active: "curiosity",
};
const tabs = document.querySelectorAll(".tab");
// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state, InformationRender, Image);
};
// create content
const App = (state, InformationRender, Image) => {
  const { roverInfo, images } = state;

  return HTML_Info_Generate(roverInfo, images, InformationRender, Image);
};

window.addEventListener("load", async () => {
  Information_Initiate(tabs, store);
  await Rover_Info(store, "curiosity");
  render(root, store);
});

const Rover_Info = async (store, active) => {
  await getNasaRovers(store, active);
  await getimages(store, active);
};

const HTML_Info_Generate = (roverInfo, images, generateInfo, generateImage) => {
  const HTML_Info = generateInfo(roverInfo);
  const HTML_Image = generateImage(images);
  return `
        <div>
            <div class="info-container">
                ${HTML_Info}
            </div>
            <section class="image-container">
                ${HTML_Image}
            </section>
        </div>
    `;
};

const Information_Initiate = async (tabs, store) => {
  tabs.forEach((tab) => {
    tab.addEventListener("click", async (e) => {
      const active = e.target.id;
      await updateStore(store, { active: active });
      Rover_Info(store, active);
      Present(tabs, active);
    });
  });
};

const Present = (tabs, active) => {
  tabs.forEach((tab) => {
    if (tab.id !== active) {
      tab.classList.remove("active");
    } else {
      tab.classList.add("active");
    }
  });
};
//roverInfo API-----------------
const getNasaRovers = (store, roverName) => {
  fetch(`http://localhost:3000/roverInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roverName: roverName }),
  })
    .then((res) => res.json())
    .then((roverInfo) => updateStore(store, { roverInfo: roverInfo }));
};
//HTML Components------------------------------
const InformationRender = (details) => {
  return `
        <figure>
            <img src="${details.imageUrl}" alt="${details.name}" class="main-rover-img"/>
            <figcaption>An image of ${details.name} rover</figcaption>
        </figure>
        <div class="info">
            <strong>Introduction</strong>
            <p>${details.about}</p>
            <br/>
            <strong>Max Speed</strong>
            <p>${details.maxSpeed}</p>
            <br/>
            <strong>Launch Date</strong>
            <p>${details.launchDate}</p>
            <br/>
  
    `;
};
const Image = (images) => {
  let HTML_Image = ``;

  images.slice(0, 3).map((image) => {
    HTML_Image += `
                    <figure class="image-card">
                        <img src="${image.img_src}" alt="Rover image" class="rover-image"/>
                        <figcaption>
                            
                            <span><b>Earth date:</b> ${image.earth_date}</span>
                        </figcaption>
                    </figure>`;
  });
  return HTML_Image;
};
//Image API----------------------------------------------
const getimages = (store, roverName) => {
  fetch(`http://localhost:3000/fetchImage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roverName: roverName }),
  })
    .then((res) => res.json())
    .then((images) => updateStore(store, { images: images }));
};
