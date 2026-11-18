// 沒有圖片時使用的假圖（placehold.co 會在圖上顯示文字）
const NO_IMAGE = 'https://placehold.co/800x520.png?text=No+Image'

// 產生「標籤 + 內容」的一列，內容為空就不顯示
const row = (label, text) => {
  if (!text) return null
  return {
    type: 'box',
    layout: 'baseline',
    spacing: 'sm',
    contents: [
      { type: 'text', text: label, color: '#aaaaaa', size: 'sm', flex: 2 },
      { type: 'text', text: String(text), wrap: true, color: '#666666', size: 'sm', flex: 5 },
    ],
  }
}

export default (value) => {
  const hasImage = /^https:\/\//.test(value.Column1 || '')
  const feature = (value.Feature || '').replace(/\s+/g, ' ').trim()
  const address = `${value.County || ''}${value.Township || ''}${value.SalePlace || ''}`

  const rows = [
    row('特色', feature.length > 100 ? feature.slice(0, 100) + '…' : feature),
    row('價格', value.SpecAndPrice ? `NT$ ${value.SpecAndPrice}` : ''),
    row('生產單位', value.ProduceOrg),
    row('電話', value.ContactTel),
    row('購買地點', address),
  ].filter(Boolean)

  const footerButtons = [
    {
      type: 'button',
      style: 'link',
      height: 'sm',
      action: {
        type: 'uri',
        label: '地圖',
        uri:
          value.Latitude && value.Longitude
            ? `https://www.google.com/maps/search/?api=1&query=${value.Latitude},${value.Longitude}`
            : encodeURI(`https://www.google.com/maps/search/?api=1&query=${value.Name}`),
      },
    },
  ]

  if (/^https?:\/\//.test(value.OrderUrl || '')) {
    footerButtons.push({
      type: 'button',
      style: 'link',
      height: 'sm',
      action: { type: 'uri', label: '訂購連結', uri: value.OrderUrl },
    })
  }

  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: hasImage ? value.Column1 : NO_IMAGE,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: value.Name, weight: 'bold', size: 'xl', wrap: true },
        ...(hasImage ? [] : [{ type: 'text', text: '（無附圖片）', size: 'xs', color: '#aaaaaa' }]),
        { type: 'box', layout: 'vertical', margin: 'lg', spacing: 'sm', contents: rows },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: footerButtons,
      flex: 0,
    },
  }
}
