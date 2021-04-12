import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import storejs from 'store';
import '@/utils/filter'
import '@/icons'
import '@/permission'
import Viser from 'viser-vue'
import {
  Button,
  Tabs,
  Form,
  Input,
  Icon,
  Row,
  Col,
  Checkbox,
  message,
  Layout,
  notification,
  Menu,
  Select,
  Badge,
  Popover,
  Dropdown,
  Avatar,
  Modal,
  Tooltip,
  Card,
  List,
  Statistic,
  Cascader,
  Table,
  Switch,
  Steps,
  FormModel,
  Radio,
  DatePicker,
  ConfigProvider,
  Space,
  Upload,
  Transfer,
  Result
} from 'ant-design-vue';
import { DEFAULT_COLOR, TOGGLE_THEME } from '@/store/mutation-types'

const { confirm } = Modal;
Vue.config.productionTip = false
Vue.use(Button);
Vue.use(Tabs);
Vue.use(Form);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(Menu);
Vue.use(Layout);
Vue.use(Select)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(Avatar)
Vue.use(Modal)
Vue.use(Tooltip)
Vue.use(Card)
Vue.use(List)
Vue.use(Statistic)
Vue.use(Cascader)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Steps)
Vue.use(FormModel)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(ConfigProvider)
Vue.use(Space)
Vue.use(Upload)
Vue.use(Transfer)
Vue.use(Result)
Vue.use(Viser)
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$confirm = confirm;

new Vue({
  store,
  router,
  mounted() {
    store.commit(DEFAULT_COLOR, storejs.get(DEFAULT_COLOR))
    store.commit(TOGGLE_THEME, storejs.get(TOGGLE_THEME)) 
  },
  render: h => h(App),
}).$mount('#app')
