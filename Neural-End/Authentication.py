
TOKEN = "7&8F@k#4sT9mDzA2%jPw@QnEiL5XoG1hV6rYcK3lSxZuNv0eBqIyM"
def authenticated(request):
    if 'TOKEN' not in request.headers or request.headers['TOKEN'] != TOKEN:
        return False
    return True
