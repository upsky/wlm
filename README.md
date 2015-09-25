## Тестовый запуск
1. Установите метеор (http://meteor.com)
1. Если метеор уже был установлен - сбросить базу: meteor reset
1. Запустите meteor --settings settings.json
1. Вход под админом: admin@wlm.ru / admin и под портнером: partner@wlm.ru / partner

## Запуск на iOS > 9
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

Добавить в Build Settings > Header Search Paths
  $(BUILT_PRODUCTS_DIR)/../emulator/include