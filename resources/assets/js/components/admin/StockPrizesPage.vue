<template>
<div  >
  <admin-menu page="/stock-prizes"></admin-menu>
  <div v-if="checkToken && stockPrizesLoaded">
		<h5>Stock Prizes</h5>
		<table class="table table-striped">
		  <thead>
				<tr>
					<th>id</th>
					<th>Name</th>
                    <th>Description</th>
                    <th>Cost</th>
                    <th>Amount</th>
                    <th>Image</th>
                    <th>Tier</th>
                    <th>Website URL</th>
                    <th>Video URL</th>
                    <th>Prize type</th>
                    <th>Manufacturer</th>
                    <th>Store URL</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in stockPrizes" :key="item.id">
					<td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
					<td>
                        <span v-if="item.description">{{ item.description }}</span>
                    </td>
                    <td>{{ item.cost }}</td>
                    <td>{{ item.amount }}</td>
                    <td>
                        <img 
                          v-if="item.image"
                          v-bind:src="imagesUrl + item.image"
                          v-bind:style="styleImage"
                          alt="prize image"/>
                    </td>
                    <td> {{ item.tier }}</td>
                    <td> {{ item.website_url || '' }}</td>
                    <td> {{ item.video_url || ''}}</td>
                    <td> {{ item.type }}</td>
                    <td> {{ item.manufacturer || '' }}</td>
                    <td> {{ item.store_url || '' }}</td>
					<td>
						<button class="btn btn-xs btn-danger" @click.prevent="confirmDeleteAction(item)">del</button>
						<button class="btn btn-xs btn-warning" @click.prevent="editAction(item)">edit</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div>
            <form>
                <div class="form-row">
                    <div class="form-group col-md-2">
                        <label>Name</label>
                        <input class="form-control" placeholder="Name..." v-model="editItem.name" type="text">
                    </div>
                    <div class="form-group col-md-4">
                        <label>Description</label>
                        <input class="form-control" placeholder="Description..." v-model="editItem.description" type="text">
                    </div>
                    <div class="form-group col-md-1">
                        <label>Cost</label>
                        <input class="form-control" placeholder="Cost..." v-model="editItem.cost" type="number">
                    </div>
                    <div class="form-group col-md-1">
                        <label>Amount</label>
                        <input class="form-control" placeholder="Amount..." v-model="editItem.amount" type="number">
                    </div>
                    <div class="form-group col-md-2">
                        <label>Rarity class</label>
                        <select class="form-control" v-model="editItem.rarity_class_id">
                            <option value="0" disabled>Rarity class</option>
                            <option v-for="rarityClass in rarityClasses" v-bind:value="rarityClass.id" :key="rarityClass.id">{{ translateRarity(rarityClass.name) }}</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-1">
                        <label>Type</label>
                        <select class="form-control" v-model="editItem.prize_type_id">
                            <option v-for="prizeType in prizeTypes" v-bind:value="prizeType.id" :key="prizeType.id">{{ prizeType.name }}</option>
                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Website URL</label>
                        <input class="form-control" placeholder="Website URL..." v-model="editItem.website_url" type="text">
                    </div>
                    <div class="form-group col-md-3">
                        <label>Video URL</label>
                        <input class="form-control" placeholder="Video URL..." v-model="editItem.video_url" type="text">
                    </div>
                    <div class="form-group col-md-2">
                        <label>Manufacturer</label>
                        <input class="form-control" placeholder="Manufacturer..." v-model="editItem.manufacturer" type="text">
                    </div>
                    <div class="form-group col-md-3">
                        <label>Store URL</label>
                        <input class="form-control" placeholder="Store URL..." v-model="editItem.store_url" type="text">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <div v-if="editMode">
                            <button @click.prevent="saveAction()" class="btn btn-success">SAVE</button>
                            <button @click.prevent="editCancelAction()" class="btn btn-default">cancel</button>
                        </div>
                        <button v-else @click.prevent="createAction()" class="btn btn-success">Create new</button>
                    </div>
                </div>
                <div class="form-row">
                </div>
			</form>
		</div>
		<modal-delete 
			v-bind:name="deletingItem.name"
			v-bind:opened="deletingItem.openModal"
			v-on:close-delete-modal="deletingItem.openModal=false"
			v-on:confirm-delete="deleteAction"
			>
		</modal-delete>
        <modal-alert
          AlertType="warning"
          v-bind:messages="errors"
          v-bind:opened="openAlertModal"
          v-on:close-alert-modal="openAlertModal=false"
        >
        </modal-alert>
        <upload-image
          title="Image"
          v-bind:fileName="editItem.image"
          v-on:upload-file="uploadImage($event)"
        >
        </upload-image>
	</div>
  <div v-if="checkToken && !stockPrizesLoaded"  class="v-loading"></div>
  <h5 v-if="!checkToken">login first</h5>
</div>
</template>
<script>
  import { mapGetters} from 'vuex';
  var config = require('../config/config.json');
	
  export default {
    data: () => {
      return {
			editMode: false,
			editItem: {
				name: '',
                description: '',
                cost: 0,
                amount : 0,
                image: null,
                rarity_class_id: 0,
                website_url: '',
                video_url: '',
                prize_type_id: 0,
                manufacturer: '',
                store_url: 0,
				id: 0,
			},
			deletingItem: {
				name: '',
				id: 0,
				openModal: false,
			},
            errors: [],
            openAlertModal: false,
            image: false,
            styleImage: {
                width: "100px",
                border: "1px #888 solid",
                borderRadius: "2px",
            },
            imagesUrl : (config.baseUrl + '/storage/'),
        }
    },
		mounted() {
			if (this.checkToken) {
				this.getList();
			}
		},
    methods: {
			confirmDeleteAction: function (item) {
				this.deletingItem.name = item.name;
				this.deletingItem.id = item.id;
				this.deletingItem.openModal = true;
			},
			deleteAction: function () {
				this.$store.dispatch('StockPrizeDeleteAction', this.deletingItem.id);
				this.deletingItem.openModal = false;
			},
			editAction: function (item) {
				this.editItem.name = item.name;
                this.editItem.description = item.description ? item.description : '';
                this.editItem.cost = item.cost;
                this.editItem.amount = item.amount;
                this.editItem.image = null;
                this.editItem.rarity_class_id = item.rarity_class_id;
                this.editItem.id = item.id;
                this.editItem.website_url = item.website_url;
                this.editItem.video_url = item.video_url;
                this.editItem.prize_type_id = item.prize_type_id;
                this.editItem.manufacturer = item.manufacturer;
                this.editItem.store_url = item.store_url;
				this.editMode = true;
			},
			createAction: function () {
                this.errors = [];
                if (this.editItem.name == '') {
                    this.errors.push('prize name empty');
                }
                if (this.errors.length == 0) {
                    this.$store.dispatch('StockPrizeCreateAction', this.editItem);
                    this.editItem.name = '';
                    this.editItem.description = '';
                    this.editItem.cost = 0;
                    this.editItem.amount = 0;
                    this.editItem.item_type_id = 0;
                    this.editItem.image = null;
                    this.editItem.icon = null;
                    this.editItem.rarity_class_id = 0;
                    this.editItem.website_url = '';
                    this.editItem.video_url = '';
                    this.editItem.manufacturer = '';
                    this.editItem.store_url = '';
                    this.editItem.prize_type_id = 0;
                } else {
                    this.openAlertModal = true;
                }
			},
			getList: function () {
                this.$store.dispatch('StockPrizeListAction');
			},
			saveAction: function() {
                this.errors = [];
                if (this.editItem.name == '') {
                    this.errors.push('prize name empty');
                }
                if (this.errors.length == 0) {
                    this.$store.dispatch('StockPrizeUpdateAction', this.editItem);
                    this.editItem.name = '';
                    this.editItem.description = '';
                    this.editItem.cost = 0;
                    this.editItem.amount = 0;
                    this.editItem.image = null;
                    this.editItem.id = 0;
                    this.editItem.rarity_class_id = 0;
                    this.editItem.website_url = '';
                    this.editItem.video_url = '';
                    this.editItem.manufacturer = '';
                    this.editItem.store_url = '';
                    this.editItem.prize_type_id = 0;
                    this.editMode = false;
                } else {
                    this.openAlertModal = true;
                }
			},
			createCancelAction: function() {
				this.editMode = false;
			},
            uploadImage: function(file) {
                this.editItem.image = file;
            },
            translateRarity: function(RarityName) {
                switch (RarityName) {
                    case 'common':
                        return 'Tier 1';
                    case 'uncommon':
                        return 'Tier 2';
                    case 'rare':
                        return 'Tier 3';
                    case 'epic':
                        return 'Tier 4';
                    case 'legendary':
                        return 'Tier 5';
                    default:
                        return 'unknown';
                }
            },
    },
    computed: {
			...mapGetters([
				'checkToken',
                'stockPrizes',
                'stockPrizesLoaded',
                'stockPrizesSaved',
                'rarityClasses',
                'prizeTypes',
			]),
    }
  }
</script>