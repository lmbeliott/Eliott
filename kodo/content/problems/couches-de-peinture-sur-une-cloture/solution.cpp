#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    vector<int> d(n + 2, 0);   // tableau des différences
    for (int k = 0; k < m; k++) {
        int l, r;
        cin >> l >> r;
        d[l]++;
        d[r + 1]--;
    }
    int maximum = 0, nb_max = 0, sans = 0;
    int c = 0;                 // nombre de couches de la planche i
    for (int i = 1; i <= n; i++) {
        c += d[i];
        if (c > maximum) {
            maximum = c;
            nb_max = 1;
        } else if (c == maximum) {
            nb_max++;
        }
        if (c == 0) {
            sans++;
        }
    }
    cout << maximum << " " << nb_max << " " << sans << "\n";
    return 0;
}
