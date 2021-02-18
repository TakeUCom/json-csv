<template>
  <v-container>
    <v-row>
      <v-file-input
        truncate-length="15"
        accept="application/json"
        @change="getFileContent"
      ></v-file-input>
    </v-row>
    <v-row>
      <v-switch v-model="deleteDuplicate" label="重複削除"></v-switch>
    </v-row>
    <vue-json-to-csv
      :json-data="getCsvData()"
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
  private jsonData: Array<any> = [];
  private deleteDuplicate = true;

  get labels() {
    const labels: any = {
      userId: { title: "ユーザID" },
      datetime: { title: "登録日時" }
    };
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

    const json = JSON.parse(this.text);

    const ans: Array<any> = [];
    for (const item of json) {
      const a: any = {};
      a["userId"] = item.user_id;
      a["datetime"] = item.timestamp;
      for (const ax of item.axes) {
        const key = "axis" + String(ax.point_rank);
        a[key] = ax.aptitude_test_axis_id;
      }
      ans.push(a);
    }
    ans.sort(function(a, b) {
      if (a.datetime < b.datetime) {
        return 1;
      }
      return -1;
    });

    return ans;
  }

  getCsvData() {
    if (this.deleteDuplicate) {
      const idSet: Set<string> = new Set();
      const ans = [];
      for (const item of this.jsonData) {
        if (!idSet.has(item.userId)) {
          idSet.add(item.userId);
          ans.push(item);
        }
      }
      return ans;
    }
    return this.jsonData;
  }
}
</script>
