from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient,errors as pymongo_errors


logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]

db = MongoClient(mongo_uri)['test_db']
collection = db['todos']        

class TodoListView(APIView):

    def get(self, request):
        # Implement this method - return all todo items from db instance above.

        try:
            todos = []
            # Always find newest firstt
            for todo in collection.find().sort("_id", -1):
                todos.append({
                    "id": str(todo["_id"]),
                    "text": todo["text"]
                })
            return Response(todos, status=status.HTTP_200_OK)

        except pymongo_errors.PyMongoError as e:
            logger.error(f"Failed to fetch todos from MongoDB: {e}")
            return Response({'error': 'Error retrieving todo items.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            


        
       
    def post(self, request):
        # Implement this method - accept a todo item in a mongo db, persist it using db instance above.
        try:
            todo_item = json.loads(request.body)
            todo_text = todo_item.get('text')

            if not todo_text:
                return Response({'error': 'Todo item text is required.'}, status=status.HTTP_400_BAD_REQUEST)

            result = collection.insert_one({'text': todo_text})

            return Response(
                {
                    "id": str(result.inserted_id),
                    "text": todo_text
                },
                status=status.HTTP_201_CREATED
            )
        
        except pymongo_errors.PyMongoError as e:
            logger.error(f"Failed to insert todo into MongoDB: {e}")
            return Response({'error': 'Error inserting todo item.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

       

   