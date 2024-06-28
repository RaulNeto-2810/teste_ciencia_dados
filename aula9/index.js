const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(
    async ()=>  {
        const browser = await puppeteer.launch({
            headless: true,
            args:[
                '--no-sandbox',
                '--disable-gpu'
            ]
        });

    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});    
    
    const response = await page.goto('https://www.flashscore.com/');

    if(response.ok()){
        // console.log('Página carregada com sucesso!');
        await scrapeData(page);
    }else{
        // console.log('Falha ao carregar a página!');
    }

    await browser.close();
})();

async function scrapeData(page){
    const start = Date.now();

    await page.waitForSelector('button.calendar__navigation--yesterday');
    // console.log('Botão ontem encontrado!');

    await page.click('button.calendar__navigation--yesterday');
    // console.log('Botão ontem clicado!');

    await page.waitForSelector('div.filters__text--default');
    // console.log('Filtro encontrado!');

    const fineshedButton = (await page.$$('div.filters__text--default'))[1];
    // console.log('Botão de finalizados encontrado!');

    await fineshedButton.click();
    await page.waitForSelector('div.event__match--twoLine');
    // console.log('Times carregados com sucesso');

    const dados = {
        HOME: [],
        AWAY: [],
        FTHG: [],
        FTAG: []
    }

    const eventos = (await page.$$('div.event__match--twoLine'));
    for (evento of eventos){
        try{
            const home = await evento.$eval('div.event__homeParticipant', el => el.innerText);
            const away = await evento.$eval('div.event__awayParticipant', el => el.innerText);
            const fthg = await evento.$eval('div.event__score--home', el => el.innerText);
            const ftag = await evento.$eval('div.event__score--away', el => el.innerText);

            dados.HOME.push(home);
            dados.AWAY.push(away);
            dados.FTHG.push(fthg);
            dados.FTAG.push(ftag);

            // console.log(`${home} ${fthg} x ${ftag} ${away}`);
        } catch (error){
            console.log('Erro ao capturar dados do evento');
        }
    }
    // console.log(dados);
    // console.log(eventos);
    saveToCSV(dados);
    const end = Date.now();
    console.log(`Tempo de execução: ${(end - start)/1000} segundos`);
}

function saveToCSV(dados){
    const header = 'HOME; AWAY; FTHG; FTAG';
    const rows = dados.HOME.map((home, index) => `${home}; ${dados.AWAY[index]}; ${dados.FTHG[index]}; ${dados.FTAG[index]}\n`).join('');

    const csvContent = header + rows;
    const filename = path.join(__dirname, 'dataseteflashcore.csv');

    fs.writeFileSync(filename, csvContent, 'utf8');
    console.log('Arquivo salvo com sucesso!');

}
