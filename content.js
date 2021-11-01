function renderLikes({ data }) {
  const body = document.querySelector('body')
  const popup = document.createElement('div')
  const overlay = document.createElement('div')
  overlay.className = 'ratatin__popup-overlay'
  popup.className = 'ratatin__popup'
  const likes = data.results
  console.log({ likes })

  const itemElement = (user) => `
    <li>
      <img src="${user?.photos[0]?.url}" class="ratatin__item__image"/>
    </li>
  `

  popup.innerHTML = `
    <style>
      .ratatin__popup {
        background: transparent;
        position: fixed;
        top: 0px;
        width: calc(100vw);
        height: calc(100vh);
        padding: 20px;
        overflow: auto;
        z-index: 999999;
      }

      .ratatin__popup-overlay {
        content: "";
        position: fixed;
        background: rgba(255, 255, 255, .9);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999998;
      }

      .ratatin__popup__items {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .ratatin__item__image {
        width: 100%;
        height: auto;
        border-radius: 10px;
        overflow: hidden
        box-shadow: 0px 2px 18px rgb(0 0 0 / 50%);
      }
    </style>

    <ul class="ratatin__popup__items"> ${likes.map((item) =>
      itemElement(item.user)
    )} </ul>
    `

  body.appendChild(overlay)
  body.appendChild(popup)
}

async function getLikes() {
  try {
    const token = localStorage.getItem('TinderWeb/APIToken')
    const response = await fetch(
      'https://api.gotinder.com/v2/fast-match/teasers?locale=en',
      // 'https://api.gotinder.com/v2/recs/core?locale=en',
      {
        headers: {
          'x-auth-token': token,
        },
      }
    )

    const likes = await response.json()
    return likes
  } catch (err) {
    throw new Error(err)
  }
}

async function renderPopup() {
  const likes = await getLikes()
  renderLikes(likes)
}

async function togglePopup() {
  const popup = document.querySelector('.ratatin__popup')
  const popupOverlay = document.querySelector('.ratatin__popup-overlay')
  const button = document.querySelector('.ratatin__likes-button')

  if (popup) {
    popup.remove()
    popupOverlay.remove()
    button.innerText = 'show likes'
  } else {
    button.innerText = 'loading...'
    await renderPopup()
    button.innerText = 'hide likes'
  }
}

async function renderPopupButton() {
  const body = document.querySelector('body')
  const header = document.createElement('div')
  header.className = 'ratatin__header'
  header.innerHTML = `
    <style>
      .ratatin__header  {
        position: fixed;
        top: 0;
        right: 0;
        height: 47px;
        padding: 5px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 9999991;
        cursor: pointer;
      }

      .ratatin__likes-button {
        background: #e6af16;
        font-weight: bold;
        border-radius: 6px;
        color: white;
        box-shadow: 2px 2px 0 rgb(0 0 0 / 50%);
      }
    </style>
  `
  const button = document.createElement('button')
  button.className = 'ratatin__likes-button'
  button.onclick = togglePopup
  button.innerText = 'show likes'

  header.appendChild(button)
  body.appendChild(header)
}

renderPopupButton()
