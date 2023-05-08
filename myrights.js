function curl(url) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = xhr.responseText;
          const cleanedData = data.replace(/<meta property="og:.*?>/g, '');
          console.log(cleanedData);
        } else {
          console.error('Error: ' + xhr.status);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }
  
  // Example usage:
  curl('https://www.aclu.org/know-your-rights/stopped-by-police#ive-been-stopped-by-the-police-in-public');
  