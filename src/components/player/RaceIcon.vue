<template>
  <v-tooltip v-if="renderIcon" top style="white-space: pre-line">
    <template v-slot:activator="{ on }">
      <img
        v-on="on"
        :src="renderIcon"
        :title="enumToString.toString()"
        class="race-icon"
        height="24px"
        width="auto"
        :alt="enumToString.toString()"
      />
    </template>
    <span>{{ enumToString }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { useI18n } from "vue-i18n-bridge";
import { TranslateResult } from "vue-i18n";
import { getAsset } from "@/helpers/url-functions";
import { ERaceEnum } from "@/store/types";
import isNil from "lodash/isNil";

export default defineComponent({
  name: "RaceIcon",
  components: {},
  props: {
    race: {
      type: Number as PropType<ERaceEnum>,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const renderIcon = ref<string>(ERaceEnum[props.race] ? getAsset(`raceIcons/${ERaceEnum[props.race]}.png`) : "");
    const enumToString = ref<TranslateResult>(isNil(props.race) ? "" : t(`races.${ERaceEnum[props.race]}`));

    return {
      renderIcon,
      enumToString,
    };
  },
});
</script>
