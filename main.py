import sys
import os
import numpy as np

"""# Configuração do Web-Driver"""
# Utilizando o WebDriver do Selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Instanciando o Objeto ChromeOptions
options = webdriver.ChromeOptions()

# Passando algumas opções para esse ChromeOptions
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--start-maximized')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--disable-crash-reporter')
options.add_argument('--log-level=3')
options.add_argument('--disable-gpu')


# Criação do WebDriver do Chrome
wd_Chrome = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

"""# Importando as Bibliotecas"""

import pandas as pd
import time
from tqdm import tqdm

"""# Iniciando a Raspagem de Dados"""

# Com o WebDrive a gente consegue a pedir a página (URL)
wd_Chrome.get("https://www.flashscore.com/") 
time.sleep(2)

eventos = wd_Chrome.find_elements(By.CSS_SELECTOR, 'div.event__match--twoLine')
for evento in eventos:
    home = evento.find_element(By.CSS_SELECTOR, 'div.event__homeParticipant').text
    away = evento.find_element(By.CSS_SELECTOR, 'div.event__awayParticipant').text
    golsHome = evento.find_element(By.CSS_SELECTOR, 'div.event__score--home').text
    golsAway = evento.find_element(By.CSS_SELECTOR, 'div.event__score--away').text
    print(f'Evento: {home} {golsHome} x {golsAway} {away}')

# Completar:
# Acessar páginas diferentes (ao vivo, encerrados, próximos, odds) com .click() ou execute_script()
# Pegar o placar do jogo
# Pegar o tempo de jogo
# Acessar a página específica de um jogo e pegar stats
# Acessar a página específica de um time e pegar placares passados