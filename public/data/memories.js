const items = {
  "1": {
    name: "DRAM",
    path: "/assets/memories/dram.png",
    description: [
      "memória interna",
      "memória volátil",
      "acesso rápido",
      "armazenamento de maior quantidade de dados",
    ]
  },
  "2": {
    name: "SRAM",
    path: "/assets/memories/sram.png",
    description: [
      "memória interna",
      "memória volátil",
      "acesso rápido",
      "armazenamento de pouca quantidade de dados",
    ]
  },
  "3": {
    name: "MRAM",
    path: "/assets/memories/mram.png",
    description: [
      "memória interna",
      "memória volátil",
      "acesso rápido",
      "armazenamento de pouca quantidade de dados (por mais tempo)",
    ]
  },
  "4": {
    name: "Memória cache",
    path: "/assets/memories/memoria-cache.png",
    description: [
      "memória interna",
      "memória volátil",
      "acesso rápido",
      "utiliza os Flips-Flops como dispositivos",
    ]
  },
  "5": {
    name: "VRAM",
    path: "/assets/memories/vram.png",
    description: [
      "memória interna",
      "memória volátil",
      "dedicada exclusivamente a GPU",
    ]
  },
  "6": {
    name: "HD",
    path: "/assets/memories/hd.png",
    description: [
      "memória externa",
      "memória não volátil ",
      "mais barato",
      "possui discos móveis para armazenar os dados, e um braço mecânico para fazer a leitura/escrita",
    ]
  },
  "7": {
    name: "SSD",
    path: "/assets/memories/ssd.png",
    description: [
      "memória externa",
      "memória não volátil ",
      "mais rápido",
      "não conta com partes móveis para realizar a leitura",
    ]
  },
  "8": {
    name: "CD/DVD ROM",
    path: "/assets/memories/dvd-cd-rom.png",
    description: [
      "memória externa",
      "memória não volátil ",
      "os dados podem ser alterados",
    ]
  },
  "9": {
    name: "Flash ROM",
    path: "/assets/memories/flash-rom.png",
    description: [
      "memória externa",
      "memória não volátil ",
      "os dados podem ser alterados ",
      "regravação de dados é muito mais rápida",
    ]
  },
  "10": {
    name: "PROM",
    path: "/assets/memories/prom.png",
    description: [
      "memória interna",
      "memória não volátil ",
      "somente pode ser gravada uma única vez",
    ]
  },
  "11": {
    name: "EPROM",
    path: "/assets/memories/eprom.png",
    description: [
      "memória interna",
      "memória não volátil ",
      "os dados podem ser alterados (luz ultravioleta)",
    ]
  },
  "12": {
    name: "EEPROM",
    path: "/assets/memories/eeprom.png",
    description: [
      "memória interna",
      "memória não volátil ",
      "os dados podem ser alterados (eletricamente)",
    ]
  },
  "13": {
    name: "EAROM",
    path: "/assets/memories/earom.png",
    description: [
      "memória interna",
      "memória não volátil  ",
      "os dados podem ser alterados",
    ]
  },
  "14": {
    name: "DIP",
    path: "/assets/memories/dip.png",
    description: [
      "tipo de encapsulamento de memória",
      "terminais de contato soldados",
      "terminais de contato de grande espessura",
    ]
  },
  "15": {
    name: "SOJ",
    path: "/assets/memories/soj.png",
    description: [
      "tipo de encapsulamento de memória",
      "terminais de contato soldados",
      "terminais de contato em formato de J",
    ]
  },
  "16": {
    name: "TSOP",
    path: "/assets/memories/tsop.png",
    description: [
      "tipo de encapsulamento de memória",
      "terminais de contato soldados",
      "terminais de contato menores e mais finos",
    ]
  },
  "17": {
    name: "CSP",
    path: "/assets/memories/csp.png",
    description: [
      "tipo de encapsulamento de memória",
      "terminais de contato de encaixe",
      "não utiliza pinos de contato",
    ]
  },
  "18": {
    name: "SIPP",
    path: "/assets/memories/sipp.png",
    description: [
      "tipo de módulo de memória",
      "soldado na placa mãe",
    ]
  },
  "19": {
    name: "SIMM",
    path: "/assets/memories/simm.png",
    description: [
      "tipo de módulo de memória",
      "encaixado na placa mãe",
      "possui terminais em somente um lado do pente",
    ]
  },
  "20": {
    name: "DIMM",
    path: "/assets/memories/dimm.png",
    description: [
      "tipo de módulo de memória",
      "encaixado na placa mãe",
      "possui terminais em ambos os lados do pente",
    ]
  },
  "21": {
    name: "RIMM",
    path: "/assets/memories/rimm.png",
    description: [
      "tipo de módulo de memória",
      "utilizado pelas memória Rambus",
    ]
  },
  "22": {
    name: "FPM",
    path: "/assets/memories/fpm.png",
    description: [
      "tecnologia de memórias RAM",
      "possibilidade de escrever ou ler múltiplos dados de uma linha sucessivamente",
    ]
  },
  "23": {
    name: "EDO",
    path: "/assets/memories/edo.png",
    description: [
      "tecnologia de memórias RAM",
      "capacidade de acesso de múltiplos endereços da memória",
    ]
  },
  "24": {
    name: "DDR",
    path: "/assets/memories/ddr.png",
    description: [
      "tecnologia de memórias RAM",
      "aplicada em memórias SDRAM",
      "trabalha com 2 operações por ciclo de clock",
    ]
  },
  "25": {
    name: "DDR2",
    path: "/assets/memories/ddr2.png",
    description: [
      "tecnologia de memórias RAM",
      "aplicada em memórias SDRAM",
      "trabalha com 4 operações por ciclo de clock",
    ]
  },
  "26": {
    name: "DDR3",
    path: "/assets/memories/ddr3.png",
    description: [
      "tecnologia de memórias RAM",
      "aplicada em memórias SDRAM",
      "trabalha com 8 operações por ciclo de clock",
    ]
  },
  "27": {
    name: "Rambus",
    path: "/assets/memories/rambus.png",
    description: [
      "tecnologia de memórias RAM",
      "trabalha com 2 operações por ciclo de clock",
      "mais utilizadas em consoles",
      "para cada módulo instalado, um módulo vazio tem que ser instalado em outro slot",
    ]
  },
  "28": {
    name: "CMOS",
    path: "/assets/memories/cmos.png",
    description: [
      "memória interna",
      "memória volátil alimentada por uma bateria inclusa na placa mãe",
      "armazena configurações da BIOS",
    ]
  }
};

export default items;