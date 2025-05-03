export interface GeoLocationData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

export const getIPGeolocation = async (): Promise<GeoLocationData> => {
  try {
    // Tentar usar ipinfo.io que geralmente é mais preciso
    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      
      if (data && data.loc) {
        const [latitude, longitude] = data.loc.split(',').map(Number);
        
        return {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country,
          isp: data.org,
          timezone: data.timezone,
          latitude,
          longitude
        };
      }
    } catch (e) {
      console.error("Erro ao usar ipinfo.io:", e);
      // Continua para o fallback
    }
    
    // Fallback para ipapi
    const geoResponse = await fetch('https://ipapi.co/json/');
    const geoData = await geoResponse.json();
    
    return {
      ip: geoData.ip,
      city: geoData.city,
      region: geoData.region,
      country: geoData.country_name,
      isp: geoData.org,
      timezone: geoData.timezone,
      latitude: geoData.latitude,
      longitude: geoData.longitude
    };
  } catch (error) {
    console.error("Todas as tentativas de geolocalização falharam:", error);
    
    // Último fallback para apenas o IP
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      return { ip: ipData.ip };
    } catch {
      return { ip: 'Não disponível' };
    }
  }
};
