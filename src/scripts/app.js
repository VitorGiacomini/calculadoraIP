// Função para converter máscara CIDR para a máscara de sub-rede
function cidrToMask(cidr) {
    let mask = [];
    for (let i = 0; i < 4; i++) {
      if (cidr >= 8) {
        mask.push(255);
        cidr -= 8;
      } else {
        mask.push(256 - Math.pow(2, 8 - cidr));
        cidr = 0;
      }
    }
    return mask.join('.');
  }
  
  // Função para determinar a classe do IP
  function getClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D';
    return 'E';
  }
  
  // Função para calcular o endereço de rede
  function calculateNetwork(ip, mask) {
    const ipParts = ip.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    const networkParts = ipParts.map((part, i) => part & maskParts[i]);
    return networkParts.join('.');
  }
  
  // Função para calcular o endereço de broadcast
  function calculateBroadcast(network, mask) {
    const networkParts = network.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    const broadcastParts = networkParts.map((part, i) => part | (~maskParts[i] & 255));
    return broadcastParts.join('.');
  }
  
  // Função para calcular o número de sub-redes possíveis
  function calculateSubnets(cidr, classType) {
    let defaultCidr;
  
    // Define o CIDR padrão para cada classe
    if (classType === 'A') defaultCidr = 8;
    else if (classType === 'B') defaultCidr = 16;
    else if (classType === 'C') defaultCidr = 24;
    else return 1;  // Classes D e E não são divididas em sub-redes
  
    // Sub-redes possíveis são determinadas pelos bits de sub-rede adicionais
    const subnetBits = cidr - defaultCidr;
    if (subnetBits > 0) {
      return Math.pow(2, subnetBits);
    } else {
      return 1;
    }
  }
  
  // Função para calcular o número de hosts possíveis
  function calculateTotalHosts(cidr) {
    return Math.pow(2, (32 - cidr)) - 2;
  }
  
  document.getElementById('ip-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const ip = document.getElementById('ip-address').value;
    let cidr = parseInt(document.getElementById('subnet-mask').value.slice(1));  // Obtém o valor CIDR selecionado
    const mask = cidrToMask(cidr);
  
    // Calcula os valores
    const network = calculateNetwork(ip, mask);  // Calcula a rede
    const broadcast = calculateBroadcast(network, mask);  // Calcula o broadcast
    const classType = getClass(ip);  // Calcula a classe do IP
    const hostMin = network.split('.').map((part, i) => (i === 3 ? parseInt(part) + 1 : part)).join('.');  // Host mínimo
    const hostMax = broadcast.split('.').map((part, i) => (i === 3 ? parseInt(part) - 1 : part)).join('.');  // Host máximo
    const totalHosts = calculateTotalHosts(cidr);  // Calcula o total de hosts
    const subnets = calculateSubnets(cidr, classType);  // Calcula o número de sub-redes possíveis
  
    // Exibe os resultados
    document.getElementById('result-ip').textContent = ip;
    document.getElementById('result-mask').textContent = mask;
    document.getElementById('result-network').textContent = network;
    document.getElementById('result-class').textContent = classType;
    document.getElementById('result-broadcast').textContent = broadcast;
    document.getElementById('result-hostmin').textContent = hostMin;
    document.getElementById('result-hostmax').textContent = hostMax;
    document.getElementById('result-totalhosts').textContent = totalHosts;
    document.getElementById('result-subnets').textContent = subnets;
  
    document.getElementById('results').classList.remove('hidden');
  });
  