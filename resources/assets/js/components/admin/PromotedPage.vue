<template>
<div  >
  <admin-menu page="/promoted"></admin-menu>
  <div v-if="checkToken && promotedLoaded">
		<h5>Promouted Streamers</h5>
		<table class="table table-striped">
		  <thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
					<th>Game</th>
          <th>Stream id</th>
					<th>Points</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in promotedStreamers" :key="item.id">
					<td>{{item.position}}</td>
          <td>{{item.name}}</td>
					<td>{{item.game}}</td>
					<td>{{item.twitch_id}}</td>
					<td>{{item.points}}</td>
					<td>
						<button class="btn btn-xs btn-danger" @click.prevent="confirmDeleteAction(item)">del</button>
						<button @click.prevent="edit(item)" class="btn btn-warning">edit</button>
						<button @click.prevent="setUp(item.id)" class="btn btn-info">
							<i class="fa fa-arrow-up"></i>
						</button>
						<button @click.prevent="setDown(item.id)" class="btn btn-info">
							<i class="fa fa-arrow-down"></i>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div>
			<form class="form form-inline">
				<select v-model="newStreamer.streamer_id" class="form-control">
					<option value=0>Select streamer</option>
					<option v-for="streamer in streamers" v-bind:value="streamer.id" :key="streamer.id">{{streamer.name}}</option>
				</select>
				<input type="number" v-model="newStreamer.points">
				<button v-if="!editMode" @click.prevent="addAction()" class="btn btn-success">Add</button>
				<button v-if="editMode" @click.prevent="updateAction()" class="btn btn-success">Update</button>
				<button v-if="editMode" @click.prevent="cancelAction()" class="btn btn-warning">Cancel</button>
			</form>
		</div>
		<modal-delete 
			v-bind:name="deletingItem.name"
			v-bind:opened="deletingItem.openModal"
			v-on:close-delete-modal="deletingItem.openModal=false"
			v-on:confirm-delete="deleteAction"
			>
		</modal-delete>
	</div>
  <div v-if="checkToken && !promotedLoaded" class="v-loading"></div>
  <h5 v-if="!checkToken">login first</h5>
</div>
</template>
<script>
  import { mapGetters} from 'vuex';

  export default {
    data: () => {
      return {
			deletingItem: {
			    name: '',
				id: 0,
				openModal: false,
			},
			errors: [],
          	openAlertModal: false,
			editMode: false,
			newStreamer :{
				id: 0,
				streamer_id: 0,
				points: 0,
			}
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
                this.$store.dispatch('deletePromotedAction', this.deletingItem.id);
				this.deletingItem.openModal = false;
			},
			addAction: function () {
								this.$store.dispatch('addPromotedAction', this.newStreamer);
								this.flashEdit();
			},
			getList: function () {
				this.$store.dispatch('getPromotedListAction');
			},
			setUp: function (id) {
				this.$store.dispatch('upPromotedAction', id);
			},
			setDown: function (id) {
				this.$store.dispatch('downPromotedAction', id);
			},
			flashEdit() {
				this.newStreamer.id = 0;
				this.newStreamer.streamer_id = 0;
				this.newStreamer.points = 0;
			},
			edit(item) {
				
				this.editMode = true;
				this.newStreamer.streamer_id = item.streamer_id;
				this.newStreamer.id = item.id;
				this.newStreamer.points = item.points;
			},
			cancelAction() {
				this.flashEdit();
				this.editMode = false;
			},
			updateAction() {
				this.$store.dispatch('updatePromotedAction', this.newStreamer);
				this.flashEdit();
				this.editMode = false;
			}
    },
    computed: {
			...mapGetters([
				'checkToken',
				'streamers',
				'promotedStreamers',
				'promotedLoaded',
			]),
    }
  }
</script>