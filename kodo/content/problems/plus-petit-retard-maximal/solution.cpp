#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> commandes(n);   // (date limite, durée)
    for (int i = 0; i < n; i++) {
        cin >> commandes[i].second >> commandes[i].first;
    }
    sort(commandes.begin(), commandes.end());           // par date limite croissante
    long long instant = 0, pire = 0;
    for (auto& c : commandes) {
        instant += c.second;
        pire = max(pire, instant - c.first);
    }
    cout << pire << "\n";
    return 0;
}
