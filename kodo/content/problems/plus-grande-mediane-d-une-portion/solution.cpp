#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int n, k;
vector<int> a;

// existe-t-il une portion de longueur >= k de médiane >= x ?
bool ok(int x) {
    vector<int> p(n + 1, 0);
    for (int i = 0; i < n; i++) {
        p[i + 1] = p[i] + (a[i] >= x ? 1 : -1);
    }
    int mini = p[0];                // minimum de p[0..j-k]
    for (int j = k; j <= n; j++) {
        mini = min(mini, p[j - k]);
        if (p[j] - mini >= 1) {
            return true;
        }
    }
    return false;
}

int main() {
    cin >> n >> k;
    a.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    vector<int> v = a;
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    int lo = 0, hi = v.size();      // invariant : ok(v[lo]) vrai, ok(v[hi]) faux
    while (hi - lo > 1) {
        int mid = (lo + hi) / 2;
        if (ok(v[mid])) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    cout << v[lo] << "\n";
    return 0;
}
