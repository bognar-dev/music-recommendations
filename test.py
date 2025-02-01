#!/usr/bin/env python
print('If you get error "ImportError: No module named \'six\'" install six:\n'+\
    '$ sudo pip install six');
import sys
if sys.version_info[0]==2:
    import six
    from six.moves.urllib import request
    opener = request.build_opener(
        request.ProxyHandler(
            {'http': 'http://127.0.0.1:33335',
            'https': 'http://127.0.0.1:33335'}))
    print(opener.open('https://open.spotify.com/embed/track/1fvB6L3IK9PcXX9p76GBMt').read())
if sys.version_info[0]==3:
    import urllib.request
    opener = urllib.request.build_opener(
        urllib.request.ProxyHandler(
            {'http': 'http://127.0.0.1:33335',
            'https': 'http://127.0.0.1:33335'}))
    print(opener.open('https://open.spotify.com/embed/track/1fvB6L3IK9PcXX9p76GBMt').read())