export class AnimeWatching{

    constructor(
        public id:number,
        public title:string,
        public next_episode:Date,
        public time_left:any,
        public image = {
            url:'',
            width:0,
            height:0
        }
    ){}
}