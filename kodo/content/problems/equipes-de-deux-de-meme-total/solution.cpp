#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        cin >> v[i];
    }
    sort(v.begin(), v.end());
    int total = v[0] + v[n - 1];   // le plus faible doit aller avec le plus fort
    bool possible = true;
    int g = 0, d = n - 1;
    while (g < d) {
        if (v[g] + v[d] != total) {
            possible = false;
            break;
        }
        g++;
        d--;
    }
    if (possible) {
        cout << total << "\n";
    } else {
        cout << "IMPOSSIBLE\n";
    }
    return 0;
}
