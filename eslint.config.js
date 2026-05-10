import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      'firebase-security': firebaseRulesPlugin
    }
  },
  ...firebaseRulesPlugin.configs['flat/recommended'].rules
]
