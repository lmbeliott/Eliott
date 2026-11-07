#include <iostream>
using namespace std;

int main() {
    int n, mini;
    cin >> n >> mini;
    // Le minimum et le maximum partent de la première valeur.
    int maxi = mini;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x < mini) {
            mini = x;
        }
        if (x > maxi) {
            maxi = x;
        }
    }
    cout << mini << " " << maxi << "\n";
    return 0;
}
