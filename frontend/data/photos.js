// Photographs of the actual places, from Wikimedia Commons.
// Every photo is credited on the About page as its licence requires.

const commons = (path, file, width = 1920) =>
  `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/${file}/${width}px-${file}`;

export const PHOTOS = {
  hunza: { src: commons('d/dc', 'Hunza_Valley_HDR.jpg'), place: 'Karimabad, Hunza Valley', author: 'FaizanAhmad', licence: 'CC BY-SA 3.0' },
  attabad: { src: commons('5/52', 'Attabad.jpg', 1280), place: 'Attabad Lake', author: 'Peracha1', licence: 'CC BY-SA 4.0' },
  passu: { src: commons('e/e5', 'Pasu_cones.jpg'), place: 'Passu Cones', author: 'Mehrunisa Reimoo', licence: 'CC BY-SA 4.0' },
  khunjerab: { src: commons('0/0a', 'China_Border%2C_Pakistan.jpg', 1280), place: 'Khunjerab Pass', author: 'Nain Malik', licence: 'CC BY-SA 4.0' },
  skardu: { src: commons('f/f8', 'Unexpected_Snow_in_Katpana_Skardu.jpg', 1280), place: 'Katpana, Skardu', author: 'Rgyalchan', licence: 'CC BY-SA 4.0' },
  shangrila: { src: commons('5/5b', 'Shangrila%2C_Lower_Kachura_Lake.jpg', 1280), place: 'Lower Kachura Lake', author: 'Hasanijaz', licence: 'CC BY-SA 4.0' },
  shigar: { src: commons('b/b1', 'The_Intrinsic_Nature_of_Shigar_Valley%2C_Skardu_01.JPG', 1280), place: 'Shigar Valley', author: 'Raja Munawar', licence: 'CC BY-SA 3.0' },
  deosai: { src: commons('7/7b', 'Deosai_pic_hd.jpg', 1280), place: 'Deosai National Park', author: 'Hunzagrapher', licence: 'CC BY-SA 4.0' },
  fairyMeadows: { src: commons('2/29', 'Nanga_Parbat_The_Killer_Mountain.jpg'), place: 'Nanga Parbat from Fairy Meadows', author: 'Tahsin Anwar Ali', licence: 'CC BY-SA 3.0' },
  naltar: { src: commons('c/c1', 'Naltar_lake_in_Autumn%2C_Gilgit.JPG', 1280), place: 'Naltar Lake', author: 'Tipuabdul', licence: 'CC BY-SA 3.0' },
  astore: { src: commons('e/e1', 'AstorePeak.jpg', 1280), place: 'Astore Valley', author: 'Daniel Martin', licence: 'CC BY 3.0' },
  phander: { src: commons('9/94', 'Phander_Lake%2C_Ghizer%2C_Gilgit%E2%80%93Baltistan.jpg', 1280), place: 'Phander Lake, Ghizer', author: 'FaizanAhmad', licence: 'CC BY-SA 4.0' },
  khaplu: { src: commons('b/b4', 'View_of_main_entrance_of_Khaplu_Palace.jpg', 1280), place: 'Khaplu Palace', author: 'Muhammad Ashar', licence: 'CC BY-SA 3.0' },
  saifulMalook: { src: commons('d/de', 'Lake_SaifulMalook.jpeg', 1280), place: 'Lake Saif-ul-Malook', author: 'Muzaffar Bukhari', licence: 'Free Art Licence' },
  baltit: { src: commons('f/f3', 'Baltit_fort%2C_Hunza_Valley.jpg', 1280), place: 'Baltit Fort, Hunza', author: 'MuhammadUsama25', licence: 'CC BY-SA 4.0' },
  altit: { src: commons('1/10', 'Altit_fort-gb.jpg', 1280), place: 'Altit Fort, Hunza', author: 'Usamashahid433', licence: 'CC BY-SA 4.0' },
  upperKachura: { src: commons('e/e4', 'Upper_kachura_lake%2C_skardu%2C_baltistan.jpg', 1280), place: 'Upper Kachura Lake', author: 'Uzair889', licence: 'CC BY-SA 4.0' },
  rakaposhi: { src: commons('9/93', 'Rakaposhi_%26_Autumn.jpg', 1280), place: 'Rakaposhi, Nagar', author: 'mhtoori', licence: 'CC BY-SA 4.0' },
  arangKel: { src: commons('e/e9', 'Arang_Kel_Neelum.jpg', 1280), place: 'Arang Kel, Neelum Valley', author: 'Fobak', licence: 'CC BY-SA 4.0' },
  shandur: { src: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Shandur-Polo-Festivals_kahtours.jpg', place: 'Shandur Polo Festival', author: 'Addden321', licence: 'CC BY-SA 4.0' },
};
