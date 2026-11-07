#include <iostream>
using namespace std;

int main() {
    int v, r, n;
    cin >> v >> r >> n;
    long long total = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        int p = t % (v + r);          // position dans le cycle du feu
        if (p >= v) {                 // le feu est rouge
            total = total + (v + r - p);
        }
    }
    cout << total << "\n";
    return 0;
}
