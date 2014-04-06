print "{\n"    
for x in range(2,25,2):
  for y in [0, 6, 8,14]:
    print "      [{},{},{}]:1, ".format(x, y, 0)

for x in range(6, 21,2):
  for y in [2,12]:
    print "      [{},{},{}]:1, ".format(x, y, 0)

for x in range(4, 23, 2):
  for y in [4,10]:
    print "      [{},{},{}]:1, ".format(x, y, 0)

for x in range(8, 19, 2):
  for y in range(2,13, 2):
    print "      [{},{},{}]:1, ".format(x, y, 1)

for x in range(10, 17, 2):
  for y in range(4,11, 2):
    print "      [{},{},{}]:1, ".format(x, y, 2)

for x in range(12, 15, 2):
  for y in range(6,9, 2):
    print "      [{},{},{}]:1, ".format(x, y, 3)

print "      [{},{},{}]:1,".format(0, 7, 0)
print "      [{},{},{}]:1,".format(26, 7, 0)
print "      [{},{},{}]:1,".format(28, 7, 0)
print "      [{},{},{}]:1".format(13, 7, 4)

print "}"
