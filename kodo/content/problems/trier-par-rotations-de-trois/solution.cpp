#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

bool triable(const vector<long long> &a) {
    int n = a.size();
    if (n <= 2) {
        return n < 2 || a[0] <= a[1];
    }
    vector<int> ordre(n);
    for (int i = 0; i < n; i++) ordre[i] = i;
    sort(ordre.begin(), ordre.end(), [&](int i, int j) { return a[i] < a[j]; });
    for (int r = 0; r + 1 < n; r++) {
        if (a[ordre[r]] == a[ordre[r + 1]]) {
            return true;              // deux valeurs égales : toujours possible
        }
    }
    // place[i] = rang de a[i] dans la liste triée
    vector<int> place(n);
    for (int r = 0; r < n; r++) place[ordre[r]] = r;
    // nombre de cycles de la permutation
    vector<bool> vu(n, false);
    int cycles = 0;
    for (int i = 0; i < n; i++) {
        if (!vu[i]) {
            cycles++;
            int j = i;
            while (!vu[j]) {
                vu[j] = true;
                j = place[j];
            }
        }
    }
    return (n - cycles) % 2 == 0;     // nombre pair d'inversions
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int n;
        cin >> n;
        vector<long long> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        cout << (triable(a) ? "OUI" : "NON") << "\n";
    }
    return 0;
}
