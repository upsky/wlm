Tinytest.add 'pack-with-project-trans-tap-i18n - basic template rendered correctly', (test) ->
  test.equal Blaze.toHTML(Template.pack_with_project_trans_tap_i18n_package__a01_template), "n00, n01, nx2, n100, n101"

Tinytest.add 'pack-with-project-trans-tap-i18n - basic template that had been registered with registerI18nTemplate rendered correctly', (test) ->
  test.equal Blaze.toHTML(Template.pack_with_project_trans_tap_i18n_package__a01_template__post_load), "n00, n01, nx2, n100, n101"

Tinytest.add 'pack-with-project-trans-tap-i18n - basic template that had been registered with registerTemplate rendered correctly', (test) ->
  test.equal Blaze.toHTML(Template.pack_with_project_trans_tap_i18n_package__a01_template__post_load__registered_with_registerTemplate), "n00, n01, nx2, n100, n101"
