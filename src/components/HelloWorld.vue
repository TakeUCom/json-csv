<template>
  <v-container>
    <v-file-input
      truncate-length="15"
      accept="application/json"
      @change="getFileContent"
    ></v-file-input>
    <vue-json-to-csv
      :json-data="jsonData"
      :labels="labels"
      :csv-title="csvTitle"
    >
      <v-btn>
        CSVダウンロード
      </v-btn>
    </vue-json-to-csv>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import VueJsonToCsv from "vue-json-to-csv";

@Component({
  components: {
    VueJsonToCsv
  }
})
export default class HelloWorld extends Vue {
  private csvTitle = "data.csv";
  private text?: string | ArrayBuffer | null;
  private jsonData?: Array<any> = [];

  get labels() {
    const labels: any = { userId: { title: "ユーザID" } };
    for (let i = 1; i < 21; i++) {
      labels["axis" + String(i)] = {
        title: String(i) + "位の軸No."
      };
    }
    return labels;
  }

  async getFileContent(file: File) {
    try {
      this.readFile(file);
    } catch (e) {
      console.log(e);
    }
  }

  readFile(file: File) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.text = fileReader.result;
      this.jsonData = this.getJsonData();
    };

    fileReader.readAsText(file);
  }

  getJsonData() {
    if (!(typeof this.text === "string")) {
      return [];
    }

    console.log(this.text);
    const json = JSON.parse(this.text);
    console.log(json);

    const ans: Array<any> = [];
    for (const item of json) {
      const a: any = {};
      a["userId"] = item.user_id;
      for (const ax of item.axes) {
        const key = "axis" + String(ax.point_rank);
        a[key] = ax.aptitude_test_axis_id;
      }
      ans.push(a);
    }
    return ans;
  }
}
</script>
