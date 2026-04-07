import fetch from 'node-fetch';

async function check() {
  try {
    const url = 'https://jk0611.github.io/FAQ-bot/';
    const res = await fetch(url);
    const html = await res.text();
    const match = html.match(/src=[\"\']?(\/FAQ-bot\/assets\/[^\"]+)[\"\']/);
    if (!match) return console.log('Script not found');

    const scriptUrl = url.replace('/FAQ-bot/', '') + match[1];
    const jsRes = await fetch(scriptUrl);
    const js = await jsRes.text();
    
    // Just find api/chat and print 30 chars around it
    const index = js.indexOf('api/chat');
    if (index !== -1) {
      console.log('SURROUNDING TEXT:');
      console.log(js.substring(index - 50, index + 20));
    } else {
      console.log('No api/chat found.');
    }
  } catch (err) {
    console.error(err);
  }
}

check();
