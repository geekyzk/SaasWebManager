import oss2
import os
env_dist = os.environ
print(env_dist['accessKeyId'])
print(env_dist['accessKeySecret'])
print(env_dist['bucketName'])
print(env_dist['ossHost'])
auth = oss2.Auth(env_dist['accessKeyId'], env_dist['accessKeySecret'])
# Endpoint以杭州为例，其它Region请按实际情况填写。
bucket = oss2.Bucket(auth, env_dist['ossHost'], env_dist['bucketName'])
def listFiles(path):
  rootdir = path
  base_list = os.listdir(rootdir)
  filesPath = []
  for i in range(0,len(base_list)):
    path = os.path.join(rootdir, base_list[i])
    if os.path.isfile(path):
      filesPath.append(path)
    else:
      filesPath.append(listFiles(path))
  return filesPath
root_path = os.path.join(os.getcwd(),'dist')
files = listFiles(root_path)
for i in range(0,len(files)):
  filename = files[i].replace(root_path + '/','')
  result = bucket.put_object_from_file(filename, files[i])
  print('http status: {0}'.format(result.status))
# 请求ID。请求ID是请求的唯一标识，强烈建议在程序日志中添加此参数。
print('request_id: {0}'.format(result.request_id))
# ETag是put_object方法返回值特有的属性。
print('ETag: {0}'.format(result.etag))
# HTTP响应头部。
print('date: {0}'.format(result.headers['date']))