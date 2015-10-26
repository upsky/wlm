## Тестовый запуск
1. Установите метеор (http://meteor.com)
1. Если метеор уже был установлен - сбросить базу: meteor reset
1. Скопируйте private/templates/settings.json в корень проекта
1. Запустите meteor --settings settings.json
1. Вход под админом: admin@wlm.ru / admin и под портнером: partner@wlm.ru / partner

## Запуск на iOS > 9
1. Скопируйте private/templates/mobile-settings.js в корень проекта
1. Добавьте в файл WL Market-info.plist после первой строки <dict>, чтобы отключить защиту по SSL.
```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```
НЕ ИСПОЛЬЗОВАТЬ В РЕЛИЗНЫХ ВЕРСИЯХ

1. Build Settings > Use bitcode > NO
1. Поправить версию

## Archive iOS для распространения
Билдить в XCode 7.0
Если версия OS X - beta
http://stackoverflow.com/questions/32174954/submitting-app-from-building-in-xcode-6-4/32233429#32233429
  
## Упаковка Android
 Перед этим необходимо удалить все из /public/i18n и запустить проект один раз для генерации файлов.
 ./run.sh build wlm
-- ./run.sh android-sign
