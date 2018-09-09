# make-comp
Консольная утилита для создания заготовок React - компонентов по заданным шаблонам. 

Умеет создавать: 
* визуальный компонент ( js, css, md)
* компонент - контейнер
* файлы переводов

Использование: 
```make-comp ComponentName <flags>``` Создает визуальный компонент, контейнер и файлы перевода. Флаги отключают создание тех или иных составляющих.

```-h --help``` Показывает справку.

Если какие-либо файлы указанного компогнента были созданы ранее - они не перетираются.

Флаги:  
* ```-c --container``` исключает компонент - контейнер
* ```-d --docs``` исключает файл с документацией (md)
* ```-t --translation```  ислючает файлы переводов


## Запуск
Установить зависимости ```npm i```

Сделать исполняемый файл (вот тут не уверена, что именно эта команда)

```chmod u+x bin/make-comp```

```./bin/cli make-comp```

