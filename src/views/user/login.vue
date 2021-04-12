<template>
  <div class="main">
    <a-form
     :form="form"
      class="user-layout-login"
      ref="formLogin"
      id="formLogin"
    >
      <a-tabs
        class="login-tab"
        :activeKey="currentActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="changeActiveKey"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-item>
            <a-input
              v-decorator="['username',{initialValue: 'admin'}, validatorRules.username]"
              size="large"
              type="text"
              placeholder="请输入帐户名"
            >
              <a-icon
                slot="prefix"
                type="user"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              v-decorator="['password',{initialValue: 'macro123'}, validatorRules.password]"
              autocomplete="false"
              placeholder="密码"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-row :gutter="0">
            <a-col :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  v-decorator="['captcha', validatorRules.captcha]"
                  placeholder="请输入验证码"
                >
                  <a-icon
                    slot="prefix"
                    type="smile"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8" style="text-align: right">
              <img
                v-if="requestCodeSuccess"
                style="margin-top: 2px;"
                :src="randCodeImage"
                @click="handleChangeCheckCode"
              />
              <img
                v-else
                style="margin-top: 2px;"
                src="../../assets/checkcode.png"
                @click="handleChangeCheckCode"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="手机号"
              v-decorator="['mobile', validatorRules.mobile]"
            >
              <a-icon
                slot="prefix"
                type="mobile"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  placeholder="请输入验证码"
                  v-decorator="['inputCode', validatorRules.inputCode]"
                >
                  <a-icon
                    slot="prefix"
                    type="mail"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn ? '获取验证码' : `${state.time}s` "
              >获取验证码</a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox
        v-decorator="['rememberMe', {initialValue: true, valuePropName: 'checked'}]"
          >自动登录</a-checkbox
        >
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtnLoading"
          @click.stop.prevent="handleSubmit"
          >{{ loginBtnLoading ? '登录中...' : '确定' }}
        </a-button>
      </a-form-item>
      <a-row>
        <a-col :span="7">其他登录方式</a-col>
        <a-col :span="3"><a-icon type="github" class="icon" /></a-col>
        <a-col :span="3"><a-icon type="dingding" class="icon" /></a-col>
        <a-col :span="3"><a-icon type="wechat" class="icon" /></a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>

import { getAction, postAction } from "@/api/manage";
import { mapActions } from 'vuex'
export default {
  name: "login",
  data() {
    return {
        validatorRules: {
            username: {rules: [{ required: true, message: '请输入用户名'}]},
            mobile:   {rules: [{reuquired: true, message: '请输入手机号码'},{validator: this.validateMobile}]},
            password: {rules: [{ required: true, message: '请输入密码'}]},
            captcha:  {rules: [{ required: false, message: '请输入验证码'}]},
            inputCode: {rules: [{required: false, message: '请输入验证码'}]}
        },
        state: {
            time: 60,
            smsSendBtn: false
        },
        loginBtnLoading: false,
        //绑定form
        form: this.$form.createForm(this),
        currentActiveKey: "tab1",
        currdatetime: "",
        randCodeImage: "",
        requestCodeSuccess: false,
    };
  },
  components: {
    
  },
  created: function() {
    this.handleChangeCheckCode();
    console.log(this)
  },
  mounted () {
      console.log(this.form);
  },
  methods: {
    ...mapActions(['Login']),
    //获取动态验证码
    async handleChangeCheckCode() {
      this.currdatetime = new Date().getTime();
      const { data } = await getAction(`/sys/randomImage/${this.currdatetime}`);
      if (data.success) {
        this.requestCodeSuccess = true;
        this.randCodeImage = data.result;
      }
    },
    //更改tab的key
    changeActiveKey(key) {
      this.currentActiveKey = key;
    },
    //验证用动态验证码函数
    validateCaptcha(rule, value, callback) {
        const reg = /^[a-z0-9A-Z]{4}$/;
        if(!reg.test(value)) {
            callback('验证码为四位')
        } else {
            callback();
        }
    },
    //验证手机号
    validateMobile(rule, value, callback){
        const reg = /^1[0-9]{10}$/;
        if(!reg.test(value)) {
            callback('请输入正确的手机号')
        }else {
            callback();
        }
    },
    //点击获取验证码
    getCaptcha(e){
        e.preventDefault();
        let that = this;
        this.form.validateFields(['mobile'], {force: true}, async (err, values) => {
            if(!values.mobile || values.mobile.length < 11) {
                this.$message.warning('请输入11位手机号');
                return
            } else if(!err) {
                this.state.smsSendBtn = true;
                this.timer = window.setInterval(() => {
                    if(that.state.time-- <= 0) {
                        that.state.time = 60;
                        that.state.smsSendBtn = false;
                        window.clearInterval(this.timer);
                    }
                }, 1000)
            }

            const hide = this.$message.loading('验证码发送中..', 0);
            let smsParams = {};
            smsParams.mobile = values.mobile;
            smsParams.smsmode = '0';
            try {
                const { data } = await postAction('/sys/sms', smsParams);
                console.log(data)
                if(!data.success) {
                    setTimeout(hide, 0);
                    this.$notification.error({
                        message: '登录失败',
                        description: data.message
                    })
                }
                setTimeout(hide, 500)
            } catch (error) {
                setTimeout(hide, 1);
                clearInterval(this.timer);
                that.state.time = 60;
                that.state.smsSendBtn = false;
            }
        })
    },
    //处理登录
    handleSubmit(){
        this.loginBtnLoading = true;
        //登录信息
        let loginParams = {};
        //当前是账号密码登录
        if(this.currentActiveKey === 'tab1') {
            this.form.validateFields(['username','password'], {force: true}, async (errors, values) => {
                if(!errors) {
                    loginParams.username = values.username;
                    loginParams.password = values.password;
                    try {
                        const res = await this.Login(loginParams);
                        if(res.data.code === 200) {
                            this.loginBtnLoading = false;
                            this.$message.success(res.data.message)
                            this.$router.push({path: '/'}).catch(() => {});
                        } else {
                            this.$message.error(res.data.message)
                            this.loginBtnLoading = false;
                        } 
                    } catch (error) {
                        this.loginBtnLoading = false;
                    }
                } else {
                    console.log('参数验证不合法！');
                    return false
                }
            })
        }
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  background: #f0f2f5 url("../../assets/background.5825f033.svg") no-repeat 50%;
  background-size: 100%;
  display: flex;
  justify-content: center;
  .user-layout-login {
    max-width: 380px;
    margin-top: 150px;
  }
  .login-tab {
    height: 250px;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }
  .login-button {
      height: 40px;
      width: 100%;
  }
  .icon {
      font-size: 22px;
      cursor: pointer;
      color: rgb(114, 114, 114);
      :hover {
          color: rgb(69, 69, 70);
      }
  }
}
</style>
