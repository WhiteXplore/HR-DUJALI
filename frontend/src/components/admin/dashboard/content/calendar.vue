<template>
  <div>
    <v-calendar :attributes="attributes" class="h-full custom-calendar" />
  </div>
</template>

<script>
export default {
  name: "MyCalendar",
  data() {
    return {
      attributes: [
        {
          key: "today",
          highlight: true,
          dates: new Date(),
        },
      ],
    };
  },
};
</script>

<style>
.custom-calendar {
  width: 550px;
}
</style>
