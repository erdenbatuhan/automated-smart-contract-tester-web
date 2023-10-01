<template>
  <div>
    <v-card>
      <v-card-title>
        All {{ `${stringUtils.capitalizeString(dataName)}s` }}
      </v-card-title>

      <RefreshController
        v-if="props.functions"
        :refresh-interval="props.refreshInterval"
        @refresh="props.functions['fetchItems']"
      />

      <v-card-text>
        <!-- Search Bar -->
        <v-container>
          <v-text-field
            v-model="searchedValue"
            class="text-sm-caption"
            label="Search"
            variant="underlined"
            append-icon="fa fa-search"
            single-line
            hide-details
            density="compact"
          />
        </v-container>

        <!-- Table for Items -->
        <v-data-table
          class="custom-sortable"
          item-key="id"
          :headers="props.tableHeaders"
          :items="props.items"
          :items-per-page="10"
          :search="searchedValue"
          sortable
          :loading="spinner && (!items || items.length === 0)"
          loading-text="Loading..."
          fixed-header
        >
          <!-- ID & Project Name -->
          <template v-for="(column, index) in tableHeaders" #[`item.${column.key}`]="{ item }" :key="index">
            <!-- Project Name -->
            <div v-if="['id', 'projectName'].includes(column.key)">
              <p class="text-truncate" style="width: 12em;">
                {{ item.projectName }}

                <v-tooltip activator="parent" location="top">
                  {{ item.projectName }}
                </v-tooltip>
              </p>
            </div>

            <!-- Status -->
            <div v-else-if="column.key === 'status'">
              <v-chip :color="STATUS_TO_COLOR[item.status] || 'error'" size="small">
                {{
                  item.status.split(' ').length <= 2 ? (
                    item.status !== 'Inconclusive' ? item.status : 'Pending'
                  ) : item.status.split(' ').slice(-2).join(' ')
                }}

                <v-tooltip activator="parent" location="top">
                  <div v-if="typeof item.dockerExitCode === 'number'">
                    <span style="color: white"> Docker Exit Code: {{ item.dockerExitCode }} </span>
                    <br>
                    <span v-if="item.containerError" style="color: white"> {{ item.containerError }}  </span>
                  </div>
                  <span v-else-if="item.externalContainerError"> Error: {{ item.externalContainerError }} </span>
                  <span v-else> No information available! </span>
                </v-tooltip>
              </v-chip>
            </div>

            <!-- Rest -->
            <div v-else>
              {{ item[column.key] || '-' }}
            </div>
          </template>

          <!-- Actions -->
          <template
            v-if="props.functions"
            #[`item.actions`]="{ item }"
          >
            <div v-if="!['Inconclusive', 'Pending'].includes(item.status)" class="d-flex">
              <!-- Item Execution Output Icon -->
              <v-icon
                v-if="hasContainerExecutionOutput && ['Error', 'Failure', 'Success', 'Failed', 'Passed'].includes(item.status)"
                class="clickable-icon" color="info" size="x-small"
                @click.prevent="props.functions['showContainerExecutionOutput'](item)"
              >
                <i class="fa fa-bar-chart" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Show {{ dataName }} execution output
                </v-tooltip>
              </v-icon>
              <v-icon v-else class="clickable-icon" size="x-small" disabled />
              <!-- Item Edit Icon -->
              <v-icon
                v-if="editable"
                class="clickable-icon" color="success" size="x-small"
                @click.prevent="props.functions['editItem'](item)"
              >
                <i class="fa fa-pencil" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Edit the {{ dataName }}
                </v-tooltip>
              </v-icon>
              <!-- Item Download Icon -->
              <v-icon
                v-if="downloadable"
                class="clickable-icon" color="warning" size="x-small"
                @click.prevent="selectAction(props.functions['downloadItem'], 'Download', item)"
              >
                <i class="fa fa-download" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Download the {{ dataName }}
                </v-tooltip>
              </v-icon>
              <!-- Item Removal Icon -->
              <v-icon
                v-if="deletable"
                class="clickable-icon" color="error" size="x-small"
                @click.prevent="selectAction(props.functions['deleteItem'], 'Delete', item)"
              >
                <i class="fa fa-trash" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Delete the {{ dataName }}
                </v-tooltip>
              </v-icon>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Confirmation dialog for download and deletion -->
    <DownloadConfirmationDialog
      v-if="selectedActionName"
      :item-name="dataName"
      :action="selectedActionName"
      @confirm="takeAction"
      @decline="() => {
        selectedActionName = '';
        selectedItem = null;
      }"
    />
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';

import RefreshController from '@/components/data-view/RefreshController.vue';
import DownloadConfirmationDialog from '@/components/data-view/ConfirmationDialog.vue';

import stringUtils from '@/utils/stringUtils';

const STATUS_TO_COLOR = {
  'Inconclusive': 'warning', 'Pending': 'warning',
  'Error': 'error', 'Failure': 'error',  'Failed': 'error',
  'Success': 'success', 'Passed': 'success'
};

const props = defineProps({
  dataName: { type: String, default: '' },
  refreshInterval: { type: Number, default: 60 },
  tableHeaders: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  hasContainerExecutionOutput: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  downloadable: { type: Boolean, default: false },
  deletable: { type: Boolean, default: false },
  functions: { type: Object, default: null }
});

const store = useStore();
const spinner = computed(() => store.getters['global/spinner']);

const searchedValue = ref('');
const selectedAction = ref(() => {});
const selectedActionName = ref('');
const selectedItem = ref(null);

const selectAction = (action, actionName, item) => {
  selectedAction.value = action;
  selectedActionName.value = actionName;
  selectedItem.value = item;
};

const takeAction = () => {
  selectedAction.value(selectedItem.value)
    .finally(() => {
      selectedAction.value = null;
      selectedActionName.value = null;
      selectedItem.value = null;
    });
};
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
