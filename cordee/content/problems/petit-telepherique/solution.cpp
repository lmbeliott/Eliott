#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, c;
    cin >> n >> c;
    vector<int> poids(n);
    for (int i = 0; i < n; i++) cin >> poids[i];
    sort(poids.begin(), poids.end());

    int leger = 0;      // le plus léger qui attend encore
    int lourd = n - 1;  // le plus lourd qui attend encore
    int cabines = 0;
    while (leger <= lourd) {
        // le plus lourd monte dans la prochaine cabine,
        // avec le plus léger si ça ne dépasse pas la charge maximale
        if (leger < lourd && poids[leger] + poids[lourd] <= c) leger++;
        lourd--;
        cabines++;
    }
    cout << cabines << "\n";
    return 0;
}
