#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    int n;
    cin >> n;
    vector<long long> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    long long m = t[0];          // premier passage : le maximum
    for (long long x : t) {
        if (x > m) {
            m = x;
        }
    }
    for (long long x : t) {      // second passage : les écarts
        cout << m - x << " ";
    }
    cout << "\n";
    return 0;
}
