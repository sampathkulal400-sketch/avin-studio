const https = require('https');

const candidateList = [
  // 1. South Indian / Indian Wedding Bride & Groom Garland Muhurtham
  { id: "1583939003579-730e3918a45a", desc: "Indian wedding couple garland muhurtham" },
  { id: "1610030469983-98e550d6193c", desc: "Indian bride silk saree temple jewelry" },
  { id: "1606800052052-a08af7148866", desc: "Indian wedding muhurtham garlands exchange" },
  { id: "1591604466107-ec97de577aff", desc: "Indian haldi ceremony laughter" },
  { id: "1587271407850-8d438ca9fdf2", desc: "Indian wedding phera hands ceremony" },
  { id: "1604017011826-d3b4c23f8914", desc: "Indian bridal mehendi hands" },
  { id: "1545232979-8bf68ee9b1af", desc: "Indian groom sherwani turban" },
  { id: "1609151162377-794fa68b02f6", desc: "Indian couple pre-wedding outdoors" },
  { id: "1595777457583-95e059d581b8", desc: "Indian bride portrait with flowers" },
  { id: "1617059063772-34532796cdb5", desc: "Indian family pooja & celebration" },
  { id: "1534447677768-be436bb09401", desc: "Indian traditional seemantha saree ritual" },
  { id: "1519741497674-611481863552", desc: "Indian wedding mandap golden lighting" },
  { id: "1511285560929-80b456fea0bc", desc: "Indian couple estate romantic walk" },
  { id: "1599462616558-2b75fd26a283", desc: "Indian wedding couple traditional attire" },
  { id: "1519225429875-3004bb1528dc", desc: "Indian wedding mandap decoration" },
  { id: "1544005313-94ddf0286df2", desc: "Indian bridal portrait headshot" },
  { id: "1566417713940-fe7c737a9ef2", desc: "Indian groom portrait" },
  { id: "1583939411023-14783179e581", desc: "Indian wedding sindoor ritual" },
  { id: "1606216794074-735e91aa2c92", desc: "Indian bride jewelry and bindi" }
];

candidateList.forEach(item => {
  const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=800&q=80`;
  https.get(url, res => {
    console.log(`${res.statusCode} | photo-${item.id} | ${item.desc} | size: ${res.headers['content-length']}`);
  }).on('error', err => {
    console.log(`ERR | photo-${item.id} | ${err.message}`);
  });
});
