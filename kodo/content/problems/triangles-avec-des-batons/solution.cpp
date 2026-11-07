#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> l(n);
    for (int i = 0; i < n; i++) {
        cin >> l[i];
    }
    sort(l.begin(), l.end());
    long long triangles = 0;
    for (int k = 2; k < n; k++) {      // l[k] est le plus grand côté
        int g = 0, d = k - 1;
        while (g < d) {
            if (l[g] + l[d] > l[k]) {
                triangles += d - g;    // toutes les paires (i, d) avec g <= i < d
                d--;
            } else {
                g++;                   // g ne va avec aucun j restant
            }
        }
    }
    cout << triangles << "\n";
    return 0;
}
