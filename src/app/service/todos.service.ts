import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private firestore: AngularFirestore) { }

  findLastCreatedTodos(limit: number) {
    return this.firestore.collection('Todos', ref => ref.orderBy('date', 'desc').limit(limit)).snapshotChanges();
  }

  findAllTodos() {
    return this.firestore.collection('Todos', ref => ref.orderBy('date', 'desc')).snapshotChanges();
  }

  updateTodo(id: string, todo: {}) {
    return this.firestore.collection('Todos').doc(id).set(todo, { merge: true });
  }

  createTodo(todo: {}) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
      .collection('Todos')
      .add(todo)
      .then(res => {}, err => reject(err));
    });
  }

  removeToDo(id) {
    return this.firestore.collection('Todos').doc(id).delete();
  }
}
