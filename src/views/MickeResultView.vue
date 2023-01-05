<template>
  <div>
    {{question}}
  </div>
  <BarsComponent v-bind:data="submittedAnswers"/>

  <span>{{submittedAnswers}}</span>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'ResultView',
  components: {
    BarsComponent
  },
  data: function () {
    return {
      question: "",
      submittedAnswers: {
      }
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      this.submittedAnswers = update.a;
      this.question = update.q;
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
    })
  }
}
</script>
