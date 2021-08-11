<template>
  <div class="navbar-header d-xl-block d-none">
    <ul class="nav navbar-nav">
      <li class="nav-item">
        <b-link
          class="navbar-brand"
          to="/"
        >
          <span class="brand-logo">
            <b-img
              :src="skin=='light'?appLogoImageDark:appLogoImageLight"
              alt="logo"
            />
          </span>
        </b-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { BLink, BImg } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'
import useAppConfig from '@core/app-config/useAppConfig'

export default {
  components: {
    BLink,
    BImg,
  },
  setup() {
    // App Name
    const { appName, appLogoImage, appLogoImageDark, appLogoImageLight } = $themeConfig.app

    const { skin } = useAppConfig()
    
    return {
      appName,
      appLogoImage,
      appLogoImageDark,
      appLogoImageLight,
      skin,
    }
  },
}
</script>

<style>

</style>
