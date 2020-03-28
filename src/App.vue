<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  html,body{
    background: #F1F1F1;
  }
  * {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    margin: 0;
    padding: 0;
  }

  .row-div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .row-start {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .row-end {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .row-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .row-around {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .column-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .column-start {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .column-end {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  }

  .column-between {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .column-start-start {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .column-between-start {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  .column-align-start {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .text-line-clamp-one {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text-line-clamp-two {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text-line-clamp-three {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
